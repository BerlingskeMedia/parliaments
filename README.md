=======
Create your own parliament
======

# API

## GET /parliaments

This method is used to retrieve a calculated non-persisted parliament containing the most nominated candidate for each office.

Returns a JSON data structure in the following format:

```
{
  "nominations":
  [
    {
      "candidate":
      {
        "id": "8",
        "name": "Helle Thorning-Schmidt",
        "image": "http://s3.aws.com/image_helle.png"
      },
      "office":
      {
        "id": "2",
        "name": "Kirkeminister",
        "order": "xxx"
      }
    },
    {
      "candidate":
      {
        "id": "12",
        "name": "Villy Søvndal",
        "image": "http://s3.aws.com/image_villy.png"
      },
      "office":
      {
        "id": "1",
        "name": "Statsminister",
        "order": "xxx"
      }
    }
  ]
}
```

## POST /parliaments

This method is used to create a new parliament with candidate nominations. In case the candidate is a new record that must be created, the id field null or entirely omitted. The the example below Rasmus Klump will be created as a new candidate record in the candidates tabel.

Request body data must be a JSON data structure in the following format:

```
{
  "nominations":
  [
    {
      "candidate":
      {
        "id": "8"
      },
      "office":
      {
        "id": "2"
      }
    },
    {
      "candidate":
      {
        "id": null,
        "name": "Rasmus Klump",
        "image": "http://s3.aws.com/image_ramus.png"
      },
      "office":
      {
        "id": "1"
      }
    }
  ]
}
```

HTTP Header Content-Type must be application/json.

Returns a JSON data structure with the new id of the created parliament in the following structure:

```
{
  "id": "432"
}
```

## GET /parliaments/{id}

The method returns a specific parliament created by a user.

Returns a JSON data structure in the same structure as `GET /parliaments` method.

## GET /offices

This method retrieves all records from the offices table.

Returns a JSON data structure in the following format:

```
[
  {
    "id": "1",
    "name": "Statsminister"
  },
  {
    "id": "2",
    "name": "Kirkeminister"
  }
]
```

## GET /offices/{id}

This method retrieve all candidates sorted by nomination score - including candidates that has never been nominated for the office. The field score is the count the candidate has been nominated for the specified office (:id parameter in the URL).

*TODO:* Hmm, this will result in returning every candidate once for each office. This is not efficient. We could return all candidates with office nominations embedded. But will this be useful?

Returns a JSON data structure in the following format:

```
[
  {
    "id": "8",
    "name": "Helle Thorning-Schmidt",
    "image": "http://s3.aws.com/image_helle.png",
    "score": 2
  },
  {
    "id": "12",
    "name": "Villy Søvndal",
    "image": "http://s3.aws.com/image_villy.png",
    "score": 1
  },
  {
    "id": "13",
    "name": "Rasmus Klump",
    "image": "http://s3.aws.com/image_ramus.png",
    "score": 0
  }
]
```
