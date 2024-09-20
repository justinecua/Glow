from .import imagekit
import base64

class ImagekitClient(object):
    def __init__(self, file):
        self.file = self.convert_to_binary(file)
        self.file_name = file.name

    def convert_to_binary(self, file):
        self.binary_file = base64.b64encode(file.read())
        return self.binary_file

    def upload_media_file(self):
        response = imagekit.upload_file(
            file = self.file,
            file_name = self.file_name
        )
        return response.response_metadata.raw