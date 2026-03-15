from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer, UserDetailSerializer, UserUpdateSerializer
from django.contrib.auth.models import User
from django.core.mail import send_mail
import random
import string


class SignupView(APIView):

    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class TestAuthView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         return Response({
#             "message": "You are authenticated",
#             "user": request.user.username
#         })


# User detail view
class UserDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)


# Update profile view
class UpdateProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"email": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"email": "User with this email not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # generate random password
        new_password = ''.join(
            random.choices(string.ascii_letters + string.digits, k=8)
        )

        user.set_password(new_password)
        user.save()

        # send email
        send_mail(
            "Your New Password",
            f"Your new password is: {new_password}",
            "noreply@roomapp.com",
            [email],
            fail_silently=False,
        )

        return Response(
            {"message": "New password sent to email"},
            status=status.HTTP_200_OK
        )
