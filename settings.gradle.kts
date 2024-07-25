pluginManagement {
    repositories.gradlePluginPortal()
}

dependencyResolutionManagement {
    repositories.mavenCentral()
}

include("api")
include("web")
include("bld")
include("domain")