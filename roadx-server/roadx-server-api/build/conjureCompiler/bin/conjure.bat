@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  conjure startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%..

@rem Add default JVM options here. You can also use JAVA_OPTS and CONJURE_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS=

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto init

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto init

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:init
@rem Get command-line arguments, handling Windows variants

if not "%OS%" == "Windows_NT" goto win9xME_args

:win9xME_args
@rem Slurp the command line arguments.
set CMD_LINE_ARGS=
set _SKIP=2

:win9xME_args_slurp
if "x%~1" == "x" goto execute

set CMD_LINE_ARGS=%*

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\lib\conjure-4.4.0.jar;%APP_HOME%\lib\conjure-core-4.4.0.jar;%APP_HOME%\lib\commons-io-2.6.jar;%APP_HOME%\lib\picocli-3.7.0.jar;%APP_HOME%\lib\slf4j-simple-1.7.25.jar;%APP_HOME%\lib\conjure-generator-common-4.4.0.jar;%APP_HOME%\lib\conjure-api-objects-4.4.0.jar;%APP_HOME%\lib\conjure-lib-2.4.0.jar;%APP_HOME%\lib\auth-tokens-3.0.1.jar;%APP_HOME%\lib\jackson-datatype-jdk8-2.9.6.jar;%APP_HOME%\lib\errors-2.0.0.jar;%APP_HOME%\lib\jackson-databind-2.9.6.jar;%APP_HOME%\lib\jackson-dataformat-yaml-2.9.6.jar;%APP_HOME%\lib\syntactic-paths-0.6.1.jar;%APP_HOME%\lib\guava-23.6.1-jre.jar;%APP_HOME%\lib\jersey-common-2.25.1.jar;%APP_HOME%\lib\metrics-core-3.2.5.jar;%APP_HOME%\lib\slf4j-api-1.7.25.jar;%APP_HOME%\lib\preconditions-1.5.0.jar;%APP_HOME%\lib\error_prone_annotations-2.3.2.jar;%APP_HOME%\lib\resource-identifier-1.0.1.jar;%APP_HOME%\lib\jackson-annotations-2.9.6.jar;%APP_HOME%\lib\jackson-core-2.9.6.jar;%APP_HOME%\lib\snakeyaml-1.18.jar;%APP_HOME%\lib\jsr305-3.0.2.jar;%APP_HOME%\lib\checker-compat-qual-2.0.0.jar;%APP_HOME%\lib\j2objc-annotations-1.1.jar;%APP_HOME%\lib\animal-sniffer-annotations-1.14.jar;%APP_HOME%\lib\commons-lang3-3.7.jar;%APP_HOME%\lib\javax.ws.rs-api-2.0.1.jar;%APP_HOME%\lib\javax.annotation-api-1.2.jar;%APP_HOME%\lib\jersey-guava-2.25.1.jar;%APP_HOME%\lib\hk2-locator-2.5.0-b32.jar;%APP_HOME%\lib\hk2-api-2.5.0-b32.jar;%APP_HOME%\lib\javax.inject-2.5.0-b32.jar;%APP_HOME%\lib\osgi-resource-locator-1.0.1.jar;%APP_HOME%\lib\hk2-utils-2.5.0-b32.jar;%APP_HOME%\lib\aopalliance-repackaged-2.5.0-b32.jar;%APP_HOME%\lib\javassist-3.20.0-GA.jar;%APP_HOME%\lib\safe-logging-1.5.0.jar;%APP_HOME%\lib\javax.inject-1.jar

@rem Execute conjure
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %CONJURE_OPTS%  -classpath "%CLASSPATH%" com.palantir.conjure.cli.ConjureCli %CMD_LINE_ARGS%

:end
@rem End local scope for the variables with windows NT shell
if "%ERRORLEVEL%"=="0" goto mainEnd

:fail
rem Set variable CONJURE_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
if  not "" == "%CONJURE_EXIT_CONSOLE%" exit 1
exit /b 1

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega
