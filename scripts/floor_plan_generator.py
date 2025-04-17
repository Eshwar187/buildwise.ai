#!/usr/bin/env python3
"""
Floor Plan Generator - A script to generate color-efficient floor plans
This script takes a floor plan image and enhances it with better colors and clarity.
"""

import os
import sys
import argparse
import traceback
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

# Handle potential import errors gracefully
try:
    import cv2
except ImportError:
    print("Error: OpenCV (cv2) is not installed. Please install it with: pip install opencv-python")
    sys.exit(1)

try:
    import matplotlib.pyplot as plt
    from matplotlib.colors import LinearSegmentedColormap
except ImportError:
    print("Error: Matplotlib is not installed. Please install it with: pip install matplotlib")
    sys.exit(1)

import json

# Define color schemes for different room types
COLOR_SCHEMES = {
    "modern": {
        "walls": (40, 40, 40),
        "living_room": (200, 230, 255),
        "bedroom": (180, 210, 250),
        "bathroom": (190, 230, 240),
        "kitchen": (255, 230, 200),
        "dining": (240, 220, 210),
        "hallway": (220, 220, 220),
        "outdoor": (200, 240, 200),
        "text": (30, 30, 30),
        "dimensions": (70, 70, 70)
    },
    "minimal": {
        "walls": (30, 30, 30),
        "living_room": (240, 240, 240),
        "bedroom": (230, 230, 230),
        "bathroom": (220, 220, 220),
        "kitchen": (210, 210, 210),
        "dining": (200, 200, 200),
        "hallway": (190, 190, 190),
        "outdoor": (180, 180, 180),
        "text": (50, 50, 50),
        "dimensions": (100, 100, 100)
    },
    "colorful": {
        "walls": (50, 50, 50),
        "living_room": (200, 230, 180),
        "bedroom": (180, 200, 250),
        "bathroom": (170, 230, 240),
        "kitchen": (250, 220, 170),
        "dining": (240, 190, 210),
        "hallway": (220, 220, 220),
        "outdoor": (190, 240, 190),
        "text": (40, 40, 40),
        "dimensions": (80, 80, 80)
    },
    "blueprint": {
        "walls": (255, 255, 255),
        "living_room": (200, 220, 255),
        "bedroom": (180, 200, 240),
        "bathroom": (170, 210, 230),
        "kitchen": (190, 210, 220),
        "dining": (200, 210, 230),
        "hallway": (210, 220, 240),
        "outdoor": (220, 230, 250),
        "text": (20, 50, 120),
        "dimensions": (40, 70, 140)
    }
}

class FloorPlanGenerator:
    """Class to handle floor plan generation and enhancement"""

    def __init__(self, color_scheme="modern", dpi=300, show_dimensions=True, show_labels=True):
        """Initialize the floor plan generator with settings"""
        self.color_scheme = COLOR_SCHEMES.get(color_scheme, COLOR_SCHEMES["modern"])
        self.dpi = dpi
        self.show_dimensions = show_dimensions
        self.show_labels = show_labels
        self.font_path = self._get_default_font()

    def _get_default_font(self):
        """Get a default font that should be available on most systems"""
        if os.name == 'nt':  # Windows
            return "C:\\Windows\\Fonts\\Arial.ttf"
        elif os.name == 'posix':  # macOS or Linux
            # Common font locations
            font_paths = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/System/Library/Fonts/Helvetica.ttc",
                "/Library/Fonts/Arial.ttf"
            ]
            for path in font_paths:
                if os.path.exists(path):
                    return path
        # Fallback - PIL will use a default font
        return None

    def detect_rooms(self, image):
        """
        Detect rooms in the floor plan using computer vision
        Returns a dictionary of room types and their bounding boxes
        """
        # Convert to grayscale for processing
        if isinstance(image, str):
            img = cv2.imread(image)
        else:
            img = np.array(image)
            img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply threshold to get binary image
        _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Filter contours by size to identify rooms
        rooms = []
        min_area = img.shape[0] * img.shape[1] * 0.01  # Minimum 1% of image area

        for contour in contours:
            area = cv2.contourArea(contour)
            if area > min_area:
                x, y, w, h = cv2.boundingRect(contour)
                # Simple room type classification based on size and aspect ratio
                aspect_ratio = w / h
                size_ratio = area / (img.shape[0] * img.shape[1])

                # Simple heuristic for room type classification
                if size_ratio > 0.2:
                    room_type = "living_room"
                elif aspect_ratio > 1.5:
                    room_type = "hallway"
                elif aspect_ratio < 0.7:
                    room_type = "bathroom"
                elif size_ratio > 0.1:
                    room_type = "bedroom"
                elif size_ratio > 0.05:
                    room_type = "kitchen"
                else:
                    room_type = "dining"

                rooms.append({
                    "type": room_type,
                    "bbox": (x, y, x+w, y+h),
                    "contour": contour
                })

        return rooms

    def enhance_floor_plan(self, input_path, output_path=None, room_data=None):
        """
        Enhance a floor plan image with better colors and clarity

        Args:
            input_path: Path to the input floor plan image
            output_path: Path to save the enhanced floor plan (if None, will show the image)
            room_data: Optional dictionary with room information to override detection

        Returns:
            The enhanced floor plan as a PIL Image
        """
        # Load the image
        try:
            img = Image.open(input_path).convert("RGB")
        except Exception as e:
            error_msg = f"Error loading image: {e}"
            print(error_msg)
            traceback.print_exc()
            raise ValueError(error_msg)

        # Create a new blank image with white background
        enhanced = Image.new("RGB", img.size, (255, 255, 255))
        draw = ImageDraw.Draw(enhanced)

        # Detect rooms if not provided
        try:
            if not room_data:
                rooms = self.detect_rooms(img)
            else:
                rooms = room_data
        except Exception as e:
            error_msg = f"Error detecting rooms: {e}"
            print(error_msg)
            traceback.print_exc()
            raise ValueError(error_msg)

        # Draw walls (use edge detection to find walls)
        img_cv = np.array(img)
        img_cv = cv2.cvtColor(img_cv, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)

        # Dilate edges to make walls thicker
        kernel = np.ones((3, 3), np.uint8)
        dilated_edges = cv2.dilate(edges, kernel, iterations=1)

        # Convert back to PIL and draw walls
        wall_mask = Image.fromarray(dilated_edges)
        wall_color = self.color_scheme["walls"]

        # Draw walls on the enhanced image
        for x in range(img.width):
            for y in range(img.height):
                if wall_mask.getpixel((x, y)) > 0:
                    draw.point((x, y), fill=wall_color)

        # Fill rooms with colors
        for room in rooms:
            room_type = room["type"]
            color = self.color_scheme.get(room_type, (220, 220, 220))

            # Fill the room contour
            if "contour" in room:
                contour = room["contour"]
                mask = np.zeros(img_cv.shape[:2], dtype=np.uint8)
                cv2.drawContours(mask, [contour], 0, 255, -1)
                room_mask = Image.fromarray(mask)

                # Fill the room area
                for x in range(img.width):
                    for y in range(img.height):
                        if room_mask.getpixel((x, y)) > 0 and wall_mask.getpixel((x, y)) == 0:
                            draw.point((x, y), fill=color)
            else:
                # Use bounding box if contour not available
                x1, y1, x2, y2 = room["bbox"]
                draw.rectangle([x1, y1, x2, y2], fill=color, outline=wall_color)

        # Add room labels if enabled
        if self.show_labels:
            try:
                font_size = int(min(img.width, img.height) / 30)
                font = ImageFont.truetype(self.font_path, font_size) if self.font_path else ImageFont.load_default()

                for room in rooms:
                    room_type = room["type"].replace("_", " ").title()
                    x1, y1, x2, y2 = room["bbox"]
                    text_x = (x1 + x2) // 2
                    text_y = (y1 + y2) // 2

                    # Get text size and center it
                    text_width = draw.textlength(room_type, font=font)
                    text_x -= text_width // 2

                    # Draw text with a slight shadow for better readability
                    draw.text((text_x+1, text_y+1), room_type, fill=(0, 0, 0, 128), font=font)
                    draw.text((text_x, text_y), room_type, fill=self.color_scheme["text"], font=font)
            except Exception as e:
                print(f"Error adding labels: {e}")

        # Add dimensions if enabled
        if self.show_dimensions:
            try:
                # Add overall dimensions
                width_meters = img.width / 40  # Assuming 40 pixels per meter
                height_meters = img.height / 40

                dimension_text = f"{width_meters:.1f}m × {height_meters:.1f}m"
                font_size = int(min(img.width, img.height) / 40)
                font = ImageFont.truetype(self.font_path, font_size) if self.font_path else ImageFont.load_default()

                # Draw dimension text at the bottom
                text_width = draw.textlength(dimension_text, font=font)
                draw.text(
                    (img.width - text_width - 10, img.height - font_size - 10),
                    dimension_text,
                    fill=self.color_scheme["dimensions"],
                    font=font
                )
            except Exception as e:
                print(f"Error adding dimensions: {e}")

        # Apply some final enhancements
        enhanced = ImageEnhance.Contrast(enhanced).enhance(1.2)
        enhanced = ImageEnhance.Sharpness(enhanced).enhance(1.5)

        # Save or show the result
        if output_path:
            enhanced.save(output_path, dpi=(self.dpi, self.dpi))
            print(f"Enhanced floor plan saved to {output_path}")

        return enhanced

    def generate_3d_visualization(self, floor_plan_path, output_path=None, height=2.5):
        """
        Generate a simple 3D visualization of the floor plan

        Args:
            floor_plan_path: Path to the floor plan image
            output_path: Path to save the 3D visualization
            height: Height of the walls in meters

        Returns:
            Path to the saved 3D visualization
        """
        try:
            # Load the floor plan
            img = Image.open(floor_plan_path).convert("RGB")
            img_cv = np.array(img)
            img_cv = cv2.cvtColor(img_cv, cv2.COLOR_RGB2BGR)

            # Detect rooms
            rooms = self.detect_rooms(img)

            # Create a figure for 3D plot
            fig = plt.figure(figsize=(12, 10))
            ax = fig.add_subplot(111, projection='3d')

            # Set background color
            ax.set_facecolor('white')

            # Draw each room as a 3D box
            for room in rooms:
                x1, y1, x2, y2 = room["bbox"]
                room_type = room["type"]
                color = self.color_scheme.get(room_type, (220, 220, 220))

                # Normalize color values to 0-1 for matplotlib
                color = tuple(c/255 for c in color)

                # Create the floor
                x = [x1, x2, x2, x1, x1]
                y = [y1, y1, y2, y2, y1]
                z = [0, 0, 0, 0, 0]

                ax.plot(x, y, z, color='black')

                # Create a polygon for the floor
                verts = [(x1, y1, 0), (x2, y1, 0), (x2, y2, 0), (x1, y2, 0)]
                ax.add_collection3d(plt.matplotlib.collections.PolyCollection(
                    [verts], facecolors=color, alpha=0.7))

                # Create the walls
                for i in range(4):
                    ax.plot([x[i], x[i]], [y[i], y[i]], [0, height], color='black')

                # Add room label
                room_label = room_type.replace("_", " ").title()
                ax.text((x1+x2)/2, (y1+y2)/2, height/2, room_label,
                        horizontalalignment='center', size=8, color='black')

            # Set axis limits
            ax.set_xlim(0, img.width)
            ax.set_ylim(0, img.height)
            ax.set_zlim(0, height + 1)

            # Set labels
            ax.set_xlabel('X (pixels)')
            ax.set_ylabel('Y (pixels)')
            ax.set_zlabel('Height (meters)')

            # Set title
            ax.set_title('3D Floor Plan Visualization')

            # Adjust view angle
            ax.view_init(elev=30, azim=45)

            # Save or show the result
            if output_path:
                plt.savefig(output_path, dpi=self.dpi, bbox_inches='tight')
                print(f"3D visualization saved to {output_path}")
                plt.close(fig)
                return output_path
            else:
                plt.show()
                plt.close(fig)
                return None

        except Exception as e:
            print(f"Error generating 3D visualization: {e}")
            return None

    def export_floor_plan_data(self, floor_plan_path, output_path):
        """
        Export floor plan data as JSON

        Args:
            floor_plan_path: Path to the floor plan image
            output_path: Path to save the JSON data

        Returns:
            Dictionary with floor plan data
        """
        try:
            # Load the floor plan
            img = Image.open(floor_plan_path).convert("RGB")

            # Detect rooms
            rooms = self.detect_rooms(img)

            # Calculate total area and dimensions
            width_meters = img.width / 40  # Assuming 40 pixels per meter
            height_meters = img.height / 40
            total_area = width_meters * height_meters

            # Prepare room data
            room_data = []
            for room in rooms:
                x1, y1, x2, y2 = room["bbox"]
                room_width = (x2 - x1) / 40
                room_height = (y2 - y1) / 40
                room_area = room_width * room_height

                room_data.append({
                    "type": room["type"],
                    "dimensions": {
                        "width": round(room_width, 2),
                        "length": round(room_height, 2),
                        "area": round(room_area, 2)
                    },
                    "position": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2
                    }
                })

            # Create the full data structure
            floor_plan_data = {
                "dimensions": {
                    "width": round(width_meters, 2),
                    "length": round(height_meters, 2),
                    "total_area": round(total_area, 2),
                    "unit": "meters"
                },
                "rooms": room_data,
                "image": {
                    "width": img.width,
                    "height": img.height,
                    "path": floor_plan_path
                }
            }

            # Save the data
            if output_path:
                with open(output_path, 'w') as f:
                    json.dump(floor_plan_data, f, indent=2)
                print(f"Floor plan data saved to {output_path}")

            return floor_plan_data

        except Exception as e:
            print(f"Error exporting floor plan data: {e}")
            return None


def main():
    """Main function to run the script from command line"""
    parser = argparse.ArgumentParser(description='Floor Plan Generator')
    parser.add_argument('input', help='Input floor plan image path')
    parser.add_argument('--output', '-o', help='Output path for enhanced floor plan')
    parser.add_argument('--color-scheme', '-c', choices=COLOR_SCHEMES.keys(), default='modern',
                        help='Color scheme to use')
    parser.add_argument('--dpi', '-d', type=int, default=300, help='DPI for output image')
    parser.add_argument('--no-dimensions', action='store_true', help='Hide dimensions')
    parser.add_argument('--no-labels', action='store_true', help='Hide room labels')
    parser.add_argument('--3d', dest='three_d', action='store_true', help='Generate 3D visualization')
    parser.add_argument('--export-data', help='Export floor plan data as JSON')

    args = parser.parse_args()

    try:
        # Check if input file exists
        if not os.path.exists(args.input):
            print(f"Error: Input file '{args.input}' does not exist")
            sys.exit(1)

        # Create the generator
        generator = FloorPlanGenerator(
            color_scheme=args.color_scheme,
            dpi=args.dpi,
            show_dimensions=not args.no_dimensions,
            show_labels=not args.no_labels
        )

        # Generate the enhanced floor plan
        if args.output:
            enhanced = generator.enhance_floor_plan(args.input, args.output)
            if enhanced is None:
                print("Error: Failed to enhance floor plan")
                sys.exit(1)
        else:
            enhanced = generator.enhance_floor_plan(args.input)
            if enhanced is None:
                print("Error: Failed to enhance floor plan")
                sys.exit(1)
            enhanced.show()

        # Generate 3D visualization if requested
        if args.three_d:
            three_d_output = args.output.replace('.png', '_3d.png') if args.output else None
            result = generator.generate_3d_visualization(args.input, three_d_output)
            if result is None:
                print("Warning: Failed to generate 3D visualization")

        # Export data if requested
        if args.export_data:
            result = generator.export_floor_plan_data(args.input, args.export_data)
            if result is None:
                print("Warning: Failed to export floor plan data")

        print("Floor plan processing completed successfully")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
