from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
   
    # Custom exception handler for consistent error responses
    
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response = {
            'success': False,
            'error': None,
            'errors': None
        }
        
        if isinstance(response.data, dict):
            # Handle validation errors
            if 'detail' in response.data:
                custom_response['error'] = response.data['detail']
            else:
                custom_response['errors'] = response.data
        elif isinstance(response.data, list):
            custom_response['error'] = response.data[0] if response.data else 'An error occurred'
        else:
            custom_response['error'] = str(response.data)
        
        return Response(custom_response, status=response.status_code)
    
    return response
