with import <nixpkgs> {};
  stdenv.mkDerivation {
    name = "node";
    buildInputs = [
      jq
      nodejs_20
      nodejs_20.pkgs.pnpm
    ];

    nativeBuildInputs = [
      playwright-driver.browsers
    ];

    shellHook = ''
      export PATH="$PWD/node_modules/.bin/:$PATH"
      export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
      export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
      export QUIET_PLAYWRIGHT=true
      alias scripts='jq ".scripts" package.json'
    '';
  }
