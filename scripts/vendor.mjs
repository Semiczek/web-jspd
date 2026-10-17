import { mkdir, copyFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const folder = new URL('public/assets/vendor/three/', root);
await mkdir(folder, { recursive: true });
for (const file of ['three.module.min.js', 'three.core.min.js'])
  await copyFile(new URL('node_modules/three/build/' + file, root), new URL(file, folder));
await copyFile(new URL('node_modules/three/examples/jsm/environments/RoomEnvironment.js', root), new URL('RoomEnvironment.js', folder));
await copyFile(new URL('node_modules/three/LICENSE', root), new URL('LICENSE.txt', folder));
