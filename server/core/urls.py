from django.urls import path
from .views import SignupView, UserDetailView, UpdateProfileView, ForgotPasswordView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    # path("test-auth/", TestAuthView.as_view()),
    path("profile/", UserDetailView.as_view(), name="user-detail"),
    path("profile/update/", UpdateProfileView.as_view(), name="update-profile"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
]
