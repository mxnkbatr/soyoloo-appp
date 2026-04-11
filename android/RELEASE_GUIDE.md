# Release build guide

## Step 1: Generate keystore (one time only)

```bash
keytool -genkey -v -keystore soyol-release.jks -alias soyol -keyalg RSA -keysize 2048 -validity 10000
```

Place `soyol-release.jks` in the `android/` folder.

## Step 2: Create keystore.properties

Copy `keystore.properties.template` → `keystore.properties` and fill in your passwords:

```
storeFile=../soyol-release.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=soyol
keyPassword=YOUR_KEY_PASSWORD
```

## Step 3: Build release AAB

Run in the `android/` folder:

```bash
.\gradlew bundleRelease
```

AAB output: `app/build/outputs/bundle/release/app-release.aab`

## IMPORTANT

Never commit `keystore.properties` or `.jks` files to git!
They are listed in `android/.gitignore`.
