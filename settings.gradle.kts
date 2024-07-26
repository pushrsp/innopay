pluginManagement {
    repositories.gradlePluginPortal()
}

dependencyResolutionManagement {
    repositories.mavenCentral()
}

rootProject.name = "innopay"

include("api")
include("web")
include("bld")
include("domain")