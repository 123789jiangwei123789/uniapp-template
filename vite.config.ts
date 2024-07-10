import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";
import fs from "fs";

const root = process.cwd();

const pathResolve = (dir: string) => {
  return resolve(root, ".", dir);
};

const modifyManifest = (env, command) => {
  const manifestPath = "./src/manifest.json";
  let Manifest = fs.readFileSync(manifestPath, { encoding: "utf-8" });
  const replaceManifest = (path, value) => {
    const arr = path.split(".");
    const len = arr.length;
    const lastItem = arr[len - 1];

    let i = 0;
    let ManifestArr = Manifest.split(/\n/);

    for (let index = 0; index < ManifestArr.length; index++) {
      const item = ManifestArr[index];
      if (new RegExp(`"${arr[i]}"`).test(item)) ++i;
      if (i === len) {
        const hasComma = /,/.test(item);
        ManifestArr[index] = item.replace(
          new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`),
          `"${lastItem}": ${value}${hasComma ? "," : ""}`
        );
        break;
      }
    }

    Manifest = ManifestArr.join("\n");
  };
  const platform = process.argv[4];
  switch (platform) {
    case "mp-weixin":
      // 使用更改微信小程序appid
      replaceManifest("mp-weixin.appid", `"${env.VITE_WX_APP_ID}"`);
      // 发布对应版本
      if (command === "build") {
        replaceManifest("mp-weixin.envVersion", `"${env.VITE_ENV_VERSION}"`);
      }
      break;
    case "":
      // 使用更改支付宝小程序appid
      // replaceManifest("mp-alipay.appid", `"${env.VITE_ALIPAY_APP_ID}"`);
      break;
    default:
      break;
  }

  fs.writeFileSync(manifestPath, Manifest, {
    flag: "w",
  });
};
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, root);
  modifyManifest(env, command);
  return {
    plugins: [
      uni(),
      AutoImport({
        imports: ["vue", "uni-app", "pinia"], // 需要自动导入的插件
        // 目标文件
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/, // .vue
        ],
        dts: "types/auto-imports.d.ts",
      }),
    ],
    resolve: {
      extensions: [
        ".mjs",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".scss",
        ".css",
      ],
      alias: [
        {
          find: /\@\//,
          replacement: `${pathResolve("src")}/`,
        },
      ],
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: env.VITE_DROP_CONSOLE === "true",
        },
      },
    },
  };
});
