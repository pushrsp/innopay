plugins {
    id("application")
}

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(17))
}

configurations {
    // lombok
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

dependencies {
    implementation(project(":domain"))

    // lombok
    annotationProcessor("org.projectlombok:lombok")
    compileOnly("org.projectlombok:lombok")
}