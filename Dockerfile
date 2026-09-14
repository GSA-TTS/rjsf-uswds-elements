# Build stage: compile the theme package and the workbench's static assets.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/rjsf-uswds/package.json packages/rjsf-uswds/
COPY packages/uswds-form-elements/package.json packages/uswds-form-elements/
COPY apps/workbench/package.json apps/workbench/
RUN npm ci
COPY . .
RUN npm run build

# Serve stage: busybox httpd serving the built workbench.
#
# Why not nginx: cloud.gov's container runtime (garden) seccomp profile
# rejects the pwrite() syscall with EPERM, and nginx >= 1.27 uses pwrite()
# to create its pid file, so it cannot start there at all. busybox httpd
# avoids pwrite entirely and idles around 1 MB of RSS, which also keeps the
# cloud.gov memory quota minimal. Cloud Foundry supplies the listen port
# via $PORT.
FROM busybox:stable
COPY --from=build /app/apps/workbench/dist /srv
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "exec httpd -f -v -p 0.0.0.0:${PORT:-8080} -h /srv"]
