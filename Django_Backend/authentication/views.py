from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserSerializer, UserUpdateSerializer, ChangePasswordSerializer, DeleteAccountSerializer  

User = get_user_model()


class RegisterView(APIView):
   
    # User registration endpoint
    # POST /api/auth/register/
    # Body: {"email": "user@example.com", "full_name": "John Doe", "password": "SecurePass@123"}
   
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'success': True,
            'message': 'Registration successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
   
    # User login endpoint
    # POST /api/auth/login/
    # Body: {"email": "user@example.com", "password": "SecurePass@123"}
    
    permission_classes = (AllowAny,)
    
    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')
        
        # Validation
        if not email:
            return Response({
                'success': False,
                'error': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not password:
            return Response({
                'success': False,
                'error': 'Password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate user
        try:
            user = User.objects.get(email=email.lower())
        except User.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.check_password(password):
            return Response({
                'success': False,
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'success': False,
                'error': 'This account has been deactivated'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    
    # User logout endpoint 
    # POST /api/auth/logout/
    # Body: {"refresh_token": "refresh_token_here"}
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            
            if not refresh_token:
                return Response({
                    'success': False,
                    'error': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                'success': True,
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': 'Invalid or expired token'
            }, status=status.HTTP_400_BAD_REQUEST)



class UserProfileView(APIView):
   
    # Get and update user's profile
    # GET /api/auth/profile/ - Get user profile
    # PUT /api/auth/profile/ - Update user profile   
    
    def get(self, request):
        """Retrieve user profile"""
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    
    def put(self, request):
        """Update user profile"""
        serializer = UserUpdateSerializer(
            request.user, 
            data=request.data, 
            partial=True  # allow partial updates
        )
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        
        # Return updated user data
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': UserSerializer(request.user).data
        }, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
   
    # Change user password
    # POST /api/auth/change-password/
    # Body: {
    #     "current_password": "OldPass@123",
    #     "new_password": "NewPass@456",
    #     "confirm_password": "NewPass@456"
    # }
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update password
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'success': True,
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


class DeleteAccountView(APIView):
    
    # Permanently delete user account 
    # DELETE /api/auth/delete-account/
   
    # Body: {
    #     "password": "UserPassword@123",
    #     "confirmation": "DELETE"
    # }
    
    
    def delete(self, request):
        serializer = DeleteAccountSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user before deletion
        user = request.user
        user_email = user.email  
        
        # blacklist refresh token if provided
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except:
                pass  
        
        # delete user from database
        user.delete()
        
        return Response({
            'success': True,
            'message': f'Account {user_email} has been permanently deleted'
        }, status=status.HTTP_200_OK)


