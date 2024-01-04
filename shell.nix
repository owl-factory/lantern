with import <nixpkgs> {};

stdenv.mkDerivation {
    name = "node";
    buildInputs = [
      jq
      nodejs_20
      nodejs_20.pkgs.pnpm
    ];

    shellHook = ''
        export PATH="$PWD/node_modules/.bin/:$PATH"      
        alias scripts='jq ".scripts" package.json'
    '';
}
