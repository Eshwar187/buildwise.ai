#!/usr/bin/env python3
"""
Script to check if required Python packages are installed
"""

import sys
import importlib.util

def check_package(package):
    """Check if a package is installed and can be imported"""
    try:
        # Handle special case for Pillow (imported as PIL)
        if package == 'Pillow':
            import PIL
            version = PIL.__version__
            print(f"✅ {package} is installed (version: {version})")
            return True
        elif package == 'opencv-python':
            import cv2
            version = cv2.__version__
            print(f"✅ {package} is installed (version: {version})")
            return True
        elif package == 'numpy':
            import numpy
            version = numpy.__version__
            print(f"✅ {package} is installed (version: {version})")
            return True
        elif package == 'matplotlib':
            import matplotlib
            version = matplotlib.__version__
            print(f"✅ {package} is installed (version: {version})")
            return True
        else:
            module = importlib.import_module(package)
            version = getattr(module, '__version__', 'unknown')
            print(f"✅ {package} is installed (version: {version})")
            return True
    except ImportError:
        # If import fails, the package is not installed or not importable
        print(f"❌ {package} is not installed or not importable")
        return False

def main():
    """Main function"""
    required_packages = ['numpy', 'Pillow', 'opencv-python', 'matplotlib']
    missing_packages = []

    print("Checking required Python packages...\n")

    for package in required_packages:
        if not check_package(package):
            missing_packages.append(package)

    if missing_packages:
        print("\n❌ Missing packages:")
        for package in missing_packages:
            print(f"  - {package}")
        sys.exit(1)
    else:
        print("\n✅ All required packages are installed")
        sys.exit(0)

if __name__ == "__main__":
    main()
