from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Literal
import asyncio
import json
from datetime import datetime
import uvicorn
import os
import sys
import subprocess
import signal
import time
from dotenv import load_dotenv
import threading

from backend.embeddings import EmbeddingStore
from backend.metrics_extractor import MetricsExtractor
from backend.alert_manager import AlertManager
from backend.gemini_service import GeminiService

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="M.A.D.H.A.V.A.",
    description="Multi-domain Analytical Data Harvesting & Automated Verification Assistant",
    version="1.0.0"
)

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Domain = Literal['finance', 'healthcare', 'legal', 'news', 'ecommerce', 'code', 'education', 'support', 'travel', 'realestate']

# Initialize components with refined domains
embeddings = {
    'finance': EmbeddingStore(namespace='finance'),
    'healthcare': EmbeddingStore(namespace='healthcare'),
    'legal': EmbeddingStore(namespace='legal'),
    'news': EmbeddingStore(namespace='news'),
    'ecommerce': EmbeddingStore(namespace='ecommerce'),
    'code': EmbeddingStore(namespace='code'),
    'education': EmbeddingStore(namespace='education'),
    'support': EmbeddingStore(namespace='support'),
    'travel': EmbeddingStore(namespace='travel'),
    'realestate': EmbeddingStore(namespace='realestate')
}

metrics_extractor = MetricsExtractor()
alert_manager = AlertManager()
gemini_service = GeminiService()

# Global variables to store server processes
node_server_process = None
redis_server_process = None

def check_mongodb():
    """Check if MongoDB is running, if not start it"""
    try:
        from pymongo import MongoClient
        client = MongoClient('mongodb://localhost:27017/')
        client.server_info()  # This will raise an exception if MongoDB is not running
        print("✅ MongoDB is running")
    except Exception as e:
        print("Starting MongoDB...")
        try:
            subprocess.run(['brew', 'services', 'start', 'mongodb/brew/mongodb-community@7.0'], check=True)
            time.sleep(2)  # Give MongoDB time to start
            print("✅ MongoDB started successfully")
        except subprocess.CalledProcessError as e:
            print("❌ Failed to start MongoDB:", e)
            sys.exit(1)

def start_node_server():
    """Start the Node.js server"""
    global node_server_process
    try:
        print("Starting Node.js server...")
        node_server_process = subprocess.Popen(
            ['npm', 'run', 'dev'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print("✅ Node.js server started")
    except Exception as e:
        print("❌ Failed to start Node.js server:", e)
        sys.exit(1)

def start_redis_server():
    """Start the Redis server"""
    global redis_server_process
    try:
        print("Starting Redis server...")
        # First check if Redis is already running
        try:
            import redis
            client = redis.Redis(host='localhost', port=6379)
            client.ping()
            print("✅ Redis is already running")
            return
        except:
            pass

        # If not running, start Redis
        redis_server_process = subprocess.Popen(
            ['redis-server'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print("✅ Redis server started")
    except Exception as e:
        print("❌ Failed to start Redis server:", e)
        sys.exit(1)

def cleanup(signum, frame):
    """Cleanup function to stop all servers"""
    print("\nShutting down servers...")
    
    if node_server_process:
        node_server_process.terminate()
        print("Node.js server stopped")
    
    if redis_server_process:
        redis_server_process.terminate()
        print("Redis server stopped")
    
    # Stop MongoDB
    try:
        subprocess.run(['brew', 'services', 'stop', 'mongodb/brew/mongodb-community@7.0'], check=True)
        print("MongoDB stopped")
    except:
        pass

    sys.exit(0)

class QueryRequest(BaseModel):
    query: str
    domain: Domain
    user_id: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None

class QueryResponse(BaseModel):
    answer: str
    context: List[str]
    sources: List[str]
    metrics: Optional[Dict[str, Any]] = None
    insights: Optional[str] = None
    domain_specific_data: Optional[Dict[str, Any]] = None
    timestamp: str = datetime.utcnow().isoformat()

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    try:
        # Get relevant context from domain-specific embeddings
        if request.domain not in embeddings:
            raise HTTPException(status_code=400, detail=f"Invalid domain: {request.domain}")
            
        # Get domain-specific context with error handling
        try:
            context_results = embeddings[request.domain].similarity_search(
                request.query,
                k=3,
                metadata_filters=request.filters
            )
            context = [result[0] for result in context_results]
            sources = [result[1] for result in context_results]
        except Exception as e:
            print(f"Error retrieving context: {str(e)}")
            context = []
            sources = []

        # Extract metrics based on domain and context
        metrics = {}
        try:
            for text in context:
                domain_metrics = metrics_extractor.extract_domain_metrics(text, request.domain)
                metrics.update(domain_metrics)
        except Exception as e:
            print(f"Error extracting metrics: {str(e)}")
            metrics = {}

        # Generate AI response using Gemini with enhanced error handling
        try:
            ai_response = gemini_service.generate_response(
                query=request.query,
                context=context,
                domain=request.domain
            )
        except Exception as e:
            print(f"Error generating Gemini response: {str(e)}")
            ai_response = "I apologize, but I encountered an error while processing your query. Please try again later."

        # Generate domain-specific insights if metrics are available
        insights = None
        if metrics:
            try:
                insights = gemini_service.get_domain_insights(
                    domain=request.domain,
                    metrics=metrics
                )
            except Exception as e:
                print(f"Error generating insights: {str(e)}")
                insights = None

        # Add domain-specific data processing
        domain_specific_data = {}
        if request.domain == 'code':
            try:
                # Add code-specific analysis
                domain_specific_data['code_analysis'] = {
                    'suggestions': gemini_service.generate_response(
                        query="Analyze this code and suggest improvements",
                        context=context,
                        domain='code'
                    ),
                    'complexity': metrics.get('complexity', 'N/A'),
                    'language': metrics.get('language', 'N/A')
                }
            except Exception as e:
                print(f"Error processing code-specific data: {str(e)}")

        elif request.domain == 'legal':
            try:
                # Add legal-specific analysis
                domain_specific_data['legal_analysis'] = {
                    'jurisdiction': metrics.get('jurisdiction', 'N/A'),
                    'risk_level': metrics.get('risk_level', 'N/A'),
                    'compliance_status': metrics.get('compliance_status', 'N/A')
                }
            except Exception as e:
                print(f"Error processing legal-specific data: {str(e)}")

        response = {
            "answer": ai_response,
            "context": context,
            "sources": sources,
            "metrics": metrics if metrics else None,
            "insights": insights,
            "domain_specific_data": domain_specific_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Generate any relevant alerts with error handling
        if metrics:
            try:
                await alert_manager.send_alert(
                    f"{request.domain}_alert",
                    f"New insights available for {request.domain}",
                    {"domain": request.domain, **metrics}
                )
            except Exception as e:
                print(f"Error sending alert: {str(e)}")
        
        return response
        
    except Exception as e:
        print(f"Error processing query: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "message": "An error occurred while processing your query",
                "timestamp": datetime.utcnow().isoformat()
            }
        )

@app.get("/status")
async def get_status():
    """Get the current system status"""
    return {
        "status": "operational",
        "services": {
            "mongodb": "running",
            "redis": "running",
            "node": "running",
            "gateway": "running"
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/metrics/{domain}")
async def get_domain_metrics(domain: Domain):
    """Get metrics for a specific domain"""
    try:
        metrics = metrics_extractor.get_domain_metrics(domain)
        return {
            "domain": domain,
            "metrics": metrics,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    alert_manager.connections.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        alert_manager.connections.remove(websocket)

@app.get("/alerts")
async def get_alerts(
    domain: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = 50
):
    return alert_manager.get_alert_history(domain, severity, limit)

@app.get("/")
async def root():
    return {"message": "M.A.D.H.A.V.A Gateway is running"}

def start_fastapi():
    """Start the FastAPI server"""
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv('GATEWAY_PORT', 4000)))

def main():
    # Register signal handlers for cleanup
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    print("Starting M.A.D.H.A.V.A servers...")
    
    # Start all required servers
    check_mongodb()
    start_redis_server()
    start_node_server()
    
    # Start FastAPI in the main thread
    print("Starting Gateway server...")
    start_fastapi()

if __name__ == "__main__":
    main()