from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile


class SignupSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):

        user = User.objects.create_user(**validated_data)

        # Create empty profile for now
        Profile.objects.create(user=user)

        return user

class UserDetailSerializer(serializers.ModelSerializer):

    phone = serializers.CharField(source="profile.phone", read_only=True)
    bio = serializers.CharField(source="profile.bio", read_only=True)
    image = serializers.ImageField(source="profile.image", read_only=True)

    favorites = serializers.PrimaryKeyRelatedField(
        source="profile.favorites",
        many=True,
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "bio",
            "favorites",
            "image",
        ]

class UserUpdateSerializer(serializers.ModelSerializer):

    phone = serializers.CharField(source="profile.phone", required=False)
    bio = serializers.CharField(source="profile.bio", required=False)
    image = serializers.ImageField(source="profile.image", required=False)
    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "phone",
            "bio",
            "image",
            "old_password",
            "new_password",
        ]

    def update(self, instance, validated_data):

        profile_data = validated_data.pop("profile", {})
        old_password = validated_data.pop("old_password", None)
        new_password = validated_data.pop("new_password", None)

        # update user fields
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.save()

        # update profile fields
        profile = instance.profile
        profile.phone = profile_data.get("phone", profile.phone)
        profile.bio = profile_data.get("bio", profile.bio)
        profile.image = profile_data.get("image", profile.image)
        profile.save()

        # change password logic
        if old_password and new_password:
            if not instance.check_password(old_password):
                raise serializers.ValidationError(
                    {"old_password": "Old password is incorrect"}
                )

            instance.set_password(new_password)
            instance.save()

        return instance