from rest_framework import serializers


class GenerateRequestSerializer(serializers.Serializer):
    prompt = serializers.CharField(
        max_length=5000,
        help_text="The prompt describing what kind of application to generate"
    )
    
    def validate_prompt(self, value):
        if not value.strip():
            raise serializers.ValidationError("Prompt cannot be empty")
        return value.strip()


class FileSerializer(serializers.Serializer):
    path = serializers.CharField()
    content = serializers.CharField()


class MetaSerializer(serializers.Serializer):
    note = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    technologies = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    instructions = serializers.CharField(required=False)
    generated_at = serializers.CharField(required=False)
    prompt = serializers.CharField(required=False)
    error = serializers.BooleanField(required=False)
    message = serializers.CharField(required=False)
    raw = serializers.BooleanField(required=False)


class GenerateResponseSerializer(serializers.Serializer):
    id = serializers.CharField(
        help_text="Unique identifier for this generation"
    )
    files = FileSerializer(many=True)
    meta = MetaSerializer()
