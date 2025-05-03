from flask import Blueprint, request, jsonify
from ..gemini import runChat

ai_routes = Blueprint('ai', __name__)

@ai_routes.route('/chat', methods=['POST'])
async def chat():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
            
        response = await runChat(prompt)
        return jsonify({'response': response})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 