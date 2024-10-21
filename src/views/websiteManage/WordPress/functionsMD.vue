<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-03-06 16:42:08
 * @LastEditTime: 2024-08-19 22:15:34
-->
<script setup lang="ts">
import { ref } from "vue";

const code = `//  添加特色图片
function set_featured_image_from_content() {
    global $post;

    // 如果文章已有特色图片，则不执行
    if (has_post_thumbnail($post->ID)) {
        return;
    }

    // 获取文章内容
    $content = $post->post_content;

    // 正则表达式匹配文章中的第一个图片URL
    preg_match('/<img.*?src=["\'](.*?)["\'].*?>/', $content, $matches);
    if ($matches && isset($matches[1])) {
        $image_url = $matches[1];

        // 将URL转换为本地文件路径
        $upload_dir = wp_upload_dir();
        $image_path = str_replace($upload_dir['baseurl'], $upload_dir['basedir'], $image_url);

        // 确保文件存在
        if (file_exists($image_path)) {
            // 将图片添加到媒体库并获取附件ID
            $attachment_id = wp_insert_attachment(array(
                'guid'           => $image_url,
                'post_mime_type' => 'image/jpeg', // 需要根据实际图片类型调整
                'post_title'     => preg_replace('/\.[^.]+$/', '', basename($image_path)),
                'post_content'   => '',
                'post_status'    => 'inherit'
            ), $image_path);

            // 需要包含必要的文件来处理图像函数
            require_once(ABSPATH . 'wp-admin/includes/image.php');

            // 设置特色图片
            set_post_thumbnail($post->ID, $attachment_id);
        }
    }
}

// 加载自定义css
function my_css_fun() {
    wp_enqueue_style('article_custom', '/wp-content/uploads/css/article_custom.css', array(), '1.0');
}

add_action('the_post', 'set_featured_image_from_content');
add_action('draft_to_publish', 'set_featured_image_from_content');
add_action('new_to_publish', 'set_featured_image_from_content');
add_action('pending_to_publish', 'set_featured_image_from_content');
add_action('future_to_publish', 'set_featured_image_from_content');
add_action('wp_head', 'my_css_fun');`;
</script>

<template>
  <div>
    <el-scrollbar max-height="600px">
      <div>
        <span>
          1.点击建站，按钮 根据 页面要求及规范填写，并点击【建站】开始搭建wp
          网站
        </span>
      </div>
      <div>
        <span>
          2.刷当前列表，并找到新添加的站点信息，点击【新增作者】添加作者信息
        </span>
      </div>
      <div>
        <span>
          3.进入服务器：/home/[域名]/wp-content/themes/[主题名称]
          目录下（如：/home/zaimumokuhyou.com/wp-content/themes/blogier）
        </span>
        <p>
          执行： vi functions.php ，将 光标定位到 页面最后一行，将 下列代码 粘贴
          在 文件末尾后， 按 esc 按钮 输入「:wq」 后，按 回车 保存修改
        </p>
        <pre><code>{{ code }}</code></pre>
      </div>
      <div>
        <span>
          4.进入服务器：/home/[域名]/wp-content/uploads目录下（如：/home/zaimumokuhyou.com/wp-content/uploads）
          检查是否存在 css,image
          两个文件夹，若不存在，则手动在此目录下，分别执行「 mkdir css ，「
          mkdir image 」
        </span>
      </div>
      <div>
        <span class="endone">
          恭喜你！！至此，wp 的配置 完成了，点击[发旅游文章]/[发股票文章]
          试试吧～
        </span>
      </div>
      <br />
      <div>
        <h3>网站访问失败时操作：</h3>
        <p>1、在建站管理页面，将该网站 删除</p>
        <p>2、登录服务器 进入 /home 目录 将该网站文件夹删除</p>
        <p>
          3、登录服务器 执行 vi /caddy/Caddyfile 将该 网站 配置 清除后 执行:wq
          保存修改，最后执行：sudo systemctl restart caddy 重启服务
        </p>
        <p>4、登录数据库 将该网站 数据库 删除</p>
      </div>
      <br />
      <div>
        <h3>课外知识：</h3>
        <p>登录[域名] 管理后台（如：https://zaimumokuhyou.com/wp-login.php）</p>
        <div>
          <h4>关闭特色图片:</h4>
          <p>
            1.访问：https://{域名}/wp-admin/customize.php?return=%2Fwp-admin%2Fthemes.php
          </p>
          <p>2.进入 Customizing ▸ Posts/Pages Layout ▸ Page Layout</p>
          <p>找到 Show Featured Image? 并关闭，即可</p>
        </div>
        <div>
          <h4>修改作者简介:</h4>
          <p>1.访问：https://{域名}/wp-admin/customize.php</p>
          <p>
            进入 Customizing ▸ Widgets(小部件) ▸ Sidebar Widget Area(侧边栏)
          </p>
          <p>修改作者简介信息. ps：头像下方的br 栏不能动！！！</p>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.endone {
  color: red;
}
</style>
