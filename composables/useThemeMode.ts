/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { BrowserUtil, SiyuanDevice } from "zhi-device"
import { createAppLogger } from "~/common/appLogger"
import { useSettingStore } from "~/stores/useSettingStore"
import { CONSTANTS } from "~/utils/constants"

// 创建日志记录器
const logger = createAppLogger("use-theme-mode")

export const useThemeMode = async () => {
  // 获取颜色模式和运行时配置
  const color = useColorMode()
  const env = useRuntimeConfig()
  const appBase = process.env.APP_BASE
  const { getSetting, updateSetting } = useSettingStore()

  // computes
  // 获取颜色模式并暴露 computed 属性
  const colorMode = computed({
    get: () => {
      return color.value === "dark"
    },
    set: (value) => {
      color.value = value ? "dark" : "light"
    },
  })

  // methods
  // 切换暗黑模式
  const toggleDark = async () => {
    debugger
    colorMode.value = !colorMode.value

    const mode = colorMode.value ? "dark" : "light"
    if (setting.theme && setting.theme.mode) {
      setting.theme.mode = mode
    } else {
      setting.theme = {
        mode: mode,
        lightTheme: "Zhihu",
        darkTheme: "Zhihu",
      }
    }
    await updateSetting(setting)
    switchMode()
  }

  // 在 mounted 生命周期中处理加载后逻辑
  onMounted(() => {})

  const setting = await getSetting()
  const siyuanV = CONSTANTS.SIYUAN_VERSION
  const hljsV = CONSTANTS.HLJS_VERSION
  const siyuanLightTheme = setting?.theme?.lightTheme ?? "Zhihu"
  const siyuanDarkTheme = setting?.theme?.darkTheme ?? "Zhihu"
  const siyuanThemeV = setting?.theme?.themeVersion ?? "0.1.2"
  const win = SiyuanDevice.siyuanWindow()
  const isDarkMode = win?.matchMedia("(prefers-color-scheme: dark)").matches
  const detectedMode = isDarkMode ? "dark" : "light"
  // const detectedMode  setting?.theme?.mode ?? color.preference
  // const isDarkMode = detectedMode === "dark"
  useHead({
    htmlAttrs: {
      lang: setting.lang ?? "zh_CN",
      "data-theme-mode": detectedMode,
      "data-light-theme": siyuanLightTheme,
      "data-dark-theme": siyuanDarkTheme,
    },
    link: [
      {
        rel: "stylesheet",
        id: "themeDefaultStyle",
        href: `${appBase}resources/appearance/themes/${isDarkMode ? "midnight" : "daylight"}/theme.css?v=${siyuanV}`,
      },
      ...(siyuanLightTheme !== "daylight" && siyuanDarkTheme !== "midlight"
        ? [
            {
              rel: "stylesheet",
              id: "themeStyle",
              href: `${appBase}resources/appearance/themes/${
                isDarkMode ? siyuanDarkTheme : siyuanLightTheme
              }/theme.css?v=${siyuanThemeV}`,
            },
          ]
        : []),
      {
        rel: "stylesheet",
        id: "protyleHljsStyle",
        href: `${appBase}resources/stage/protyle/js/highlight.js/styles/vs${
          isDarkMode ? "2015" : ""
        }.min.css?v=${hljsV}`,
      },
    ],
    style: [
      ...(setting.customCss
        ? setting.customCss.map((css: any) => ({
            id: css.name,
            children: css.content,
          }))
        : []),
    ],
  })

  // ==================================================
  // private methods
  // ==================================================
  const switchMode = () => {
    const isDarkMode = color.value === "dark"
    setThemeMode(isDarkMode)
  }

  // 设置主题模式
  const setThemeMode = (isDarkMode: boolean) => {
    if (BrowserUtil.isInBrowser) {
      setCssAndThemeMode(isDarkMode)
      // 记录日志
      logger.debug(isDarkMode ? "Browser Dark Mode" : "Browser Light Mode")
      logger.info(`Auto set mode, isDark => ${isDarkMode}`)
    }

    color.preference = isDarkMode ? "dark" : "light"
  }

  // 根据浏览器模式设置 CSS 和主题模式
  const setCssAndThemeMode = (isDarkMode: boolean) => {
    // 默认主题适配
    const themeDefaultStyle = document.querySelector("#themeDefaultStyle") as any
    themeDefaultStyle.href =
      appBase + `resources/appearance/themes/${isDarkMode ? "midnight" : "daylight"}/theme.css?v=${siyuanV}`

    // 代码块适配
    const protyleHljsStyle = document.querySelector("#protyleHljsStyle") as any
    protyleHljsStyle.href =
      appBase + `resources/stage/protyle/js/highlight.js/styles/vs${isDarkMode ? "2015" : ""}.min.css?v=${hljsV}`

    // 颜色模式属性
    document.documentElement.dataset.themeMode = isDarkMode ? "dark" : "light"

    // 自定义样式适配
    // customCss: [
    //     {
    //       name: "custom.css",
    //       content: "body { background-color: #f5f5f5; }",
    //     },
    //   ],
    const customCss = setting.customCss
    if (customCss) {
      for (const css of customCss) {
        const style = document.createElement("style")
        style.id = css.name
        style.innerHTML = css.content
        document.head.appendChild(style)
      }
    }
  }

  return { colorMode, toggleDark }
}
