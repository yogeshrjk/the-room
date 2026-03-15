from rest_framework import serializers
from .models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image"]


class PropertySerializer(serializers.ModelSerializer):
    # receive images from frontend
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    # return images when fetching property
    property_images = PropertyImageSerializer(
        source="images",
        many=True,
        read_only=True
    )

    owner_name = serializers.SerializerMethodField(read_only=True)
    owner_image = serializers.ImageField(source="owner.profile.image", read_only=True)
    owner_phone = serializers.CharField(source="owner.profile.phone", read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "owner",
            "owner_name",
            "owner_image",
            "owner_phone",
            "title",
            "description",
            "rent",
            "location",
            "property_type",
            "bedrooms",
            "bathrooms",
            "area",
            "wifi",
            "parking",
            "kitchen",
            "gym",
            "ac",
            "laundry",
            "water",
            "electricity",
            "furnished",
            "cctv",
            "lift",
            "property_images",
            "images",
        ]
        read_only_fields = ["owner"]

    def get_owner_name(self, obj):
        first = obj.owner.first_name or ""
        last = obj.owner.last_name or ""
        full = f"{first} {last}".strip()
        return full if full else obj.owner.username


    def create(self, validated_data):
        images = validated_data.pop("images", [])
        owner = self.context["request"].user

        property_obj = Property.objects.create(owner=owner, **validated_data)
        for img in images:
            PropertyImage.objects.create(property=property_obj, image=img)
        return property_obj

    def update(self, instance, validated_data):
        images = validated_data.pop("images", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if images is not None:
            instance.images.all().delete()
            for img in images:
                PropertyImage.objects.create(property=instance, image=img)

        return instance

    def delete(self, instance):
        request = self.context.get("request")
        if request and instance.owner != request.user:
            raise serializers.ValidationError("You can delete only your own property.")
        instance.delete()
        return instance