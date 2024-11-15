# Build the docker image with `pnpm dockerBuild -F zhi-server-vue3-ssr`.
# Tip: Modify "dockerBuild" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t vue3-ssr`.
#FROM node:18-alpine
FROM registry.cn-shenzhen.aliyuncs.com/terwer/dm:node-18-alpine

# default env
ENV HOST=0.0.0.0
ENV PORT=3000
ENV DIST_PATH /app

WORKDIR /app

RUN addgroup --system nuxt3-blog && \
    adduser --system -G nuxt3-blog nuxt3-blog

USER nuxt3-blog

COPY .output/ .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
# RUN npm --prefix nuxt3-blog --omit=dev -f install

CMD [ "node", "server/index.mjs" ]