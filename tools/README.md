# Tools

This folder contains the python code used to automatically generate the musical-speaker entity data from a soundfont file. It works by using FluidSynth to query a soundfont file for instruments. Then, for each instrument, it uses FluidSynth to render a 0.45 second sample of each note (standard piano range only) to a .FLAC file. This file is then converted to a `ogg` and placed in the `src/sounds` directory. As a final step, the mod uses the mako template engine to render the entity definition file and english localization for the harvested sounds.

Percussion instruments are special cased in a variety of ways, which are evident in the source.

This code is currently written in a very inflexible manner; it's essentially a helper script hardcoded to my use case (dumping a general midi 2 spec soundfont). I may generalize it into an actual command line program if I find the time. I'm mostly committing it here as an example. That said, there's nothing in it that's inherently locking it to a particular machine. If you adjust the hardcoded paths and settings, it should work just fine for you, regardless of OS.

Basic instructions if you want to attempt this:

First, make sure you have FluidSynth installed as well as an appropriate soundfont. Also required is python 3 and pipenv. Install other dependencies with:

```sh
pipenv install
```

Now, edit dump_soundfont.py to point the script to your soundfont file. Optionally, you can also change what instruments are dumped, where it dumps to, etc.

When ready, run

```sh
pipenv run python dump_soundfont.py
```
