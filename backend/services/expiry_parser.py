import re
from datetime import datetime

class ExpiryParser:
    def __init__(self):
        # Common OCR mistakes mapping
        self.char_map = {
            'O': '0', 'D': '0', 'Q': '0',
            'I': '1', 'L': '1', 
            'S': '5', 'B': '8'
        }

    def clean_date_string(self, text):
        """Removes common OCR noise and normalizes separators."""
        # Replace common OCR misreads in what should be numeric sections
        # This is a basic version; in production, you'd use regex to target digits specifically
        text = text.upper()
        
        # Replace dashes, dots, or spaces with forward slashes
        normalized = re.sub(r'[.\-\s]+', '/', text)
        return normalized

    def parse(self, raw_text):
        """
        Extracts and validates a date from raw OCR text.
        Supports DD/MM/YYYY, DD/MM/YY, and YYYY/MM/DD
        """
        cleaned = self.clean_date_string(raw_text)
        
        # Regex patterns for various date formats
        patterns = [
            r'\b\d{2}/\d{2}/\d{4}\b',  # 16/04/2025
            r'\b\d{2}/\d{2}/\d{2}\b',  # 16/04/25
            r'\b\d{4}/\d{2}/\d{2}\b'   # 2025/04/16
        ]
        
        found_dates = []
        for pattern in patterns:
            matches = re.findall(pattern, cleaned)
            found_dates.extend(matches)

        if not found_dates:
            return None

        # Validate the dates found to ensure they are real calendar dates
        valid_dates = []
        for date_str in found_dates:
            for fmt in ("%d/%m/%Y", "%d/%m/%y", "%Y/%m/%d"):
                try:
                    dt = datetime.strptime(date_str, fmt)
                    # Return the first valid date found as a standardized string
                    return dt.strftime("%d/%m/%Y")
                except ValueError:
                    continue

        return None

# Example usage for testing
if __name__ == "__main__":
    parser = ExpiryParser()
    test_text = "EXPIRY DATE 16-04-2025 BATCH 001"
    print(f"Parsed Date: {parser.parse(test_text)}")