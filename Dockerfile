FROM nginx:latest
LABEL Author lijiao
RUN mkdir /usr/share/nginx/html/static
COPY dist/* /usr/share/nginx/html/
RUN mv /usr/share/nginx/html/css/ /usr/share/nginx/html/js/ /usr/share/nginx/html/fonts/ /usr/share/nginx/html/img/ /usr/share/nginx/html/static/
COPY build/gfcq.conf /etc/nginx/conf.d/gfcq.conf