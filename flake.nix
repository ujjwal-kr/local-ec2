{
  description = "Generic Python development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        python = pkgs.python312;
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs
            pkgs.pnpm
            python
            python.pkgs.virtualenv
            python.pkgs.pip
          ];

          shellHook = ''
            # File validation
            [ ! -f requirements.txt ] && { echo "❌ Missing requirements.txt"; exit 1; }


            # Python environment
            [ ! -d env ] && python -m venv env
            source env/bin/activate
            echo "🐍 Installing Python dependencies..."
            pip install -r requirements.txt --quiet

            # Recommend VSCode extensions
            echo "✨ To enhance your development experience, install these VSCode extensions:"
            echo "   - direnv: mkhl.direnv"
            echo "   - Nix IDE: bbenoist.nix"
            echo "   - Nix Environment Selector: arrterian.nix-env-selector"
            echo "   - Python: ms-python.python"
            echo "   - Python Debugger: ms-python.python"
          '';
        };
      }
    );
}
