## prerequisite

- [ACT](http://advancedcombattracker.com/download.php)
- [FFXIV_ACT_Plugin](https://github.com/ravahn/FFXIV_ACT_Plugin/releases/latest)
- [OverlayPlugin](https://github.com/ngld/OverlayPlugin/releases/latest)

We will not cover the detailed installation about **ACT** or **OverlayPlugin**. If you're confusing on install ACT and plugins, see other well-described documents.

- [Ember overlay#installation](https://github.com/GoldenChrysus/ffxiv-ember-overlay#installation)
- [cactbot#installating](https://github.com/quisquous/cactbot#installing)

## installation

1. Start **ACT**, go to the `Plugin` tab and then to the `OverlayPlugin.dll` tab.
2. Click the `New` button and set `Preset` as `Custom`, set `type` as `MiniParse` (`Name` is whether fine).

![installation-2](https://user-images.githubusercontent.com/48747221/89060064-48a01b80-d39d-11ea-8e5a-411b58082a8e.png)

3. Choose added overlay on left menu, and set `URL` as

```
https://sgosiaco.github.io/kagami
```

![installation-3](https://user-images.githubusercontent.com/48747221/89060122-6c636180-d39d-11ea-9aba-508fc2751b44.png)

4. Hit `Refresh` button and you'll see *kagami*! 🎉



## Use in OBS

1. Check your **OverlayPlugin** is ***ngld*** version, not hibiyasleep or RainbowMage version. You can see **ngld** on the `OverlayPlugin`-`General` tab.

![obs-1](https://user-images.githubusercontent.com/48747221/89059833-de877680-d39c-11ea-9ab2-feb802b02c20.png)

2. Go to `OverlayPlugin WSServer` tab and press `Start`.

![obs-2](https://user-images.githubusercontent.com/48747221/89059865-f0691980-d39c-11ea-93ae-fa88d34bafc1.png)

3. Check the status is `Running` and set `Overlay` to your supposed overlay. URL will generating in below, then copy it.

![obs-3](https://user-images.githubusercontent.com/48747221/89059886-fb23ae80-d39c-11ea-927b-11939ec9ab06.png)

4. Turn on your **OBS** and hit `Add` button on `Sources`, choose `Browser`.

![obs-4](https://user-images.githubusercontent.com/48747221/89059914-0aa2f780-d39d-11ea-98de-8ee09f273ac0.png)

5. Paste your generated URL on `URL` and hit `OK`.

![obs-5](https://user-images.githubusercontent.com/48747221/89059945-17275000-d39d-11ea-9ac6-0e63110d75aa.png)

6. Notice that the overlays on OBS will not sync your settings. To setting your *kagami* overlay on OBS, right-click your overlay source and select `Interact`.

![obs-6](https://user-images.githubusercontent.com/48747221/89059974-20182180-d39d-11ea-879b-c527ead2dd30.png)

7. Now you can setting your overlay as you comfort🙌.

![obs-7](https://user-images.githubusercontent.com/48747221/89060019-2d351080-d39d-11ea-95bf-1bf451f9fca1.png)

Other overlays also can be added with this instructions.