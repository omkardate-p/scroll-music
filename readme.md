`echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties`

<!-- for pod -->

```
cd ios
rm -rf Pods Podfile.lock
pod cache clean --all
pod install
```
