# Orion CLI

## Introduction

This is the orion CLI that with you be able to generate new project and resources like resolvers, models, services or any orion resource that you need.

## Orion generate

With this command you be able to generate a resoucerce

```
orion generate [resource] [type] [path]
```

or

```
orion g [resource] [type] [path]
```

[resource] is the type of resource what you want create, the list of resources that you be able to create is the following:

- resolvers
- echoes
- http
- jobs
- models
- repo
- services

[type] some resources needs a type because they have variatons, the type field can be:

```
  if resource is:
    resolver: // optional
      - mutation
    echoes:
      - event
      - request
    job:
      - recurrent
      - event
```

[path] is the place where you want create the resource, if you dont specifu the path this command will create the resourse where you are currently in your terminal
