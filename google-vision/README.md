# Google Vision API for Zendesk

Google Vision API can perform Web Detection directly on an image file located in Google Cloud Storage. This API reads the image path from zendesk ticket fields and detects the images over the internet.

## Cloud Vision API Sample Input/Output

To perform Web Detection, make a POST request and provide the appropriate request body, Authentication is implemented using API token.

POST https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY

### Request Payload

{
  "requests": [
    {
      "image": {
        "source": {
          "gcsImageUri": "gs://YOUR_BUCKET_NAME/YOUR_FILE_NAME"
        }
      },
      "features": [
        {
          "type": "WEB_DETECTION"
        }
      ]
    }
  ]
}

### Response Payload

If the request is successful, the server returns a 200 OK HTTP status code and the response in JSON format:

{
  "responses": [
    {
      "webDetection": {
        "webEntities": [
          {
            "entityId": "/m/0105pbj4",
            "score": 0.99534,
            "description": "Google Cloud Platform"
          },
        ],
        "partialMatchingImages": [
          {
            "url": "https://example.com/path/img.png",
            "score": 0.01
          },
        ],
        "pagesWithMatchingImages": [
          {
            "url": "https://status.cloud.google.com/",
            "score": 0.87187254
          },
        ]
      }
    }
  ]
}
