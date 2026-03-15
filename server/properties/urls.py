from django.urls import path
from .views import PropertyListView, PropertyDetailView, ToggleSavePropertyView, SavedPropertyListView

urlpatterns = [
    path("", PropertyListView.as_view(), name="property-list"),
    path("<int:pk>/", PropertyDetailView.as_view(), name="property-detail"),
    path("<int:pk>/toggle-save/", ToggleSavePropertyView.as_view()),
    path("saved/", SavedPropertyListView.as_view()),
]
