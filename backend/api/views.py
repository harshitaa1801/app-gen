import uuid
import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .services import call_genai_system
from .serializers import GenerateRequestSerializer, GenerateResponseSerializer

logger = logging.getLogger(__name__)


@api_view(['POST'])
def generate_app(request):
    """
    Generate application scaffold based on user prompt.
    
    Accepts a POST request with a 'prompt' field and returns
    generated files and metadata.
    """
    try:
        # Validate input
        serializer = GenerateRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid input", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_prompt = serializer.validated_data['prompt']
        logger.info(f"Generating app for prompt: {user_prompt[:100]}...")
        
        # Generate app scaffold using AI service
        generation_result = call_genai_system(user_prompt)
        
        # Generate unique ID for this generation
        generation_id = str(uuid.uuid4())
        
        # Prepare response
        response_data = {
            "id": generation_id,
            "files": generation_result.get("files", []),
            "meta": generation_result.get("meta", {})
        }
        
        # Validate response structure
        response_serializer = GenerateResponseSerializer(data=response_data)
        if not response_serializer.is_valid():
            logger.error(f"Invalid response structure: {response_serializer.errors}")
            return Response(
                {"error": "Internal error: invalid response structure"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        logger.info(f"Successfully generated app with ID: {generation_id}")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in generate_app view: {str(e)}")
        return Response(
            {"error": "Internal server error", "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

