from .models import Property
from .serializers import PropertySerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class PropertyListView(ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    parser_classes = (MultiPartParser, FormParser)



class PropertyDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = PropertySerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)

    def perform_destroy(self, instance):
        serializer = self.get_serializer(instance)
        serializer.delete(instance)

class ToggleSavePropertyView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

    def post(self, request, pk):
        try:
            property = Property.objects.get(pk=pk)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=404)

        profile = request.user.profile

        if profile.favorites.filter(id=property.id).exists():
            profile.favorites.remove(property)
            saved = False
        else:
            profile.favorites.add(property)
            saved = True

        return Response({
            "saved": saved,
            "property_id": property.id
        })


class SavedPropertyListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

    def get_queryset(self):
        return self.request.user.profile.favorites.all()