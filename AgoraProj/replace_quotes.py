input_file = 'dump.sql'
output_file = 'modified_dump.sql'

try:
    with open(input_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', encoding='utf-8') as outfile:
        for line in infile:
            modified_line = line.replace('"', '`')
            outfile.write(modified_line)
    print(f'Modified SQL file saved as {output_file}')
except FileNotFoundError:
    print(f'Error: {input_file} not found.')
except PermissionError:
    print('Error: Permission denied when accessing the file.')
except Exception as e:
    print(f'An unexpected error occurred: {e}')
