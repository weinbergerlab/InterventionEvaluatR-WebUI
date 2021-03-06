FROM rocker/r-base
LABEL maintainer="Ben Artin <ben@artins.org>"

### Setup apt packages needed to build the image
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y -qq

# These are only needed to build the image (and will not be present in the final image)
# ARG BUILD_APT_DEPENDENCIES=""
# RUN apt-get install -y -qq --no-install-recommends ${BUILD_APT_DEPENDENCIES}
# RUN apt-mark auto ${BUILD_APT_DEPENDENCIES}

### Setup R packages
ARG R_APT_DEPENDENCIES="libcurl4-gnutls-dev gnutls-dev libssh2-1-dev libxml2-dev zlib1g-dev libgit2-dev libssl-dev"
RUN apt-get install -y -qq --no-install-recommends ${R_APT_DEPENDENCIES}

### Setup misc other packages needed to run our build
ARG RUN_APT_DEPENDENCIES="tzdata locales"
#ARG RUN_APT_DEPENDENCIES="tzdata locales qpdf pandoc pandoc-citeproc"
RUN apt-get install -y -qq --no-install-recommends ${RUN_APT_DEPENDENCIES}

### Install required R packages
RUN install2.r devtools future
ARG INTERVENTIONEVALUATR_REF
RUN Rscript -e 'options(repos=c(getOption("repos"), INLA="https://inla.r-inla-download.org/R/stable")); devtools::install_github("weinbergerlab/InterventionEvaluatR", ref=commandArgs(trailingOnly=TRUE)[1])' "${INTERVENTIONEVALUATR_REF}"

# Finish up the configuration
RUN echo tzdata tzdata/Areas select America >> /tmp/debconf.txt
RUN echo tzdata tzdata/Zones/America select New_York >> /tmp/debconf.txt
RUN debconf-set-selections /tmp/debconf.txt
RUN rm /etc/timezone
RUN rm /etc/localtime
RUN dpkg-reconfigure --frontend noninteractive tzdata
RUN update-locale --reset LANG=en_US.utf8 LANGUAGE=en_US LC_ALL=en_US.utf8 LC_CTYPE=en_US.utf8

### Cleanup to reduce size of the image
RUN apt-get autoremove -y
RUN apt-get clean
RUN rm -rf /tmp/*

ENTRYPOINT ["/usr/bin/Rscript"]