#!/usr/bin/env python3
import struct, zlib, os

TOP = (0xEC, 0x00, 0x89)   # #ec0089
BOT = (0x7C, 0x3A, 0xED)   # #7c3aed
WHITE = (255, 255, 255, 255)

MASK_8x8_B = [
    [1,1,1,1,1,0,0,0],
    [1,1,0,0,1,1,0,0],
    [1,1,0,0,1,1,0,0],
    [1,1,1,1,1,0,0,0],
    [1,1,0,0,1,1,0,0],
    [1,1,0,0,1,1,0,0],
    [1,1,0,0,1,1,0,0],
    [1,1,1,1,1,0,0,0],
]

def png_chunk(typ, data):
    c = zlib.crc32(typ)
    c = zlib.crc32(data, c) & 0xffffffff
    return struct.pack('>I', len(data)) + typ + data + struct.pack('>I', c)

def write_png(path, w, h, rgba_bytes):
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)  # 8-bit RGBA
    # build scanlines with filter type 0
    stride = w * 4
    raw = bytearray()
    for y in range(h):
        raw.append(0)  # filter type 0
        start = y * stride
        raw += rgba_bytes[start:start+stride]
    comp = zlib.compress(bytes(raw), level=9)
    with open(path, 'wb') as f:
        f.write(sig)
        f.write(png_chunk(b'IHDR', ihdr))
        f.write(png_chunk(b'IDAT', comp))
        f.write(png_chunk(b'IEND', b''))

def lerp(a, b, t):
    return int(a + (b - a) * t)

def gradient_bg(w, h, top_rgb, bot_rgb):
    buf = bytearray(w * h * 4)
    for y in range(h):
        t = y / (h - 1) if h > 1 else 0
        r = lerp(top_rgb[0], bot_rgb[0], t)
        g = lerp(top_rgb[1], bot_rgb[1], t)
        b = lerp(top_rgb[2], bot_rgb[2], t)
        for x in range(w):
            i = (y * w + x) * 4
            buf[i+0] = r
            buf[i+1] = g
            buf[i+2] = b
            buf[i+3] = 255
    return buf

def blit_rect(buf, w, h, x0, y0, x1, y1, color):
    x0 = max(0, x0); y0 = max(0, y0); x1 = min(w, x1); y1 = min(h, y1)
    for y in range(y0, y1):
        base = y * w * 4
        for x in range(x0, x1):
            i = base + x * 4
            buf[i+0], buf[i+1], buf[i+2], buf[i+3] = color

def draw_B(buf, w, h):
    # draw an 8x8 mask scaled to the canvas with margins
    margin = max(2, int(min(w, h) * 0.12))
    grid = 8
    avail_w = w - 2*margin
    avail_h = h - 2*margin
    scale = max(1, min(avail_w // grid, avail_h // grid))
    start_x = (w - scale*grid) // 2
    start_y = (h - scale*grid) // 2
    for gy in range(grid):
        for gx in range(grid):
            if MASK_8x8_B[gy][gx]:
                x0 = start_x + gx * scale
                y0 = start_y + gy * scale
                blit_rect(buf, w, h, x0, y0, x0+scale, y0+scale, WHITE)

def make_icon(path, size):
    w = h = size
    buf = gradient_bg(w, h, TOP, BOT)
    draw_B(buf, w, h)
    write_png(path, w, h, bytes(buf))

def main():
    os.makedirs('icons', exist_ok=True)
    for s in (16, 32, 48, 128):
        out = os.path.join('icons', f'icon{s}.png')
        make_icon(out, s)
        print('wrote', out)

if __name__ == '__main__':
    main()

