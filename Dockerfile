###########
# BUILDER #
###########

# pull official base image
FROM python:3.8.3-alpine as builder

# set work directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install source packages dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache git postgresql-dev \
    gcc musl-dev zlib-dev jpeg-dev

# Install dependencies
COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

#########
# FINAL #
#########

# pull official base image
FROM python:3.8-alpine

# set work directory
ENV APP_HOME=/app
WORKDIR $APP_HOME

# install dependencies
RUN apk update && apk add libpq libjpeg
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache /wheels/*

# copy entrypoint-prod.sh
# COPY ./entrypoint.prod.sh $APP_HOME

# copy project
COPY . $APP_HOME
