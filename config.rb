###
# Extensions
###

activate :syntax
activate :minify_html
# activate :livereload

activate :blog do |blog|
  blog.permalink = "{year}/{title}.html"
  blog.sources = "articles/{year}-{month}-{day}-{title}.html"
  blog.taglink = "tags/{tag}.html"
  blog.layout = "blog-article"
  # blog.summary_separator = /(READMORE)/
  # blog.summary_length = 250

  blog.tag_template = "blog/tag.html"
  blog.year_template = "blog/calendar.html"

  # blog.paginate = true
  # blog.per_page = 10
  # blog.page_link = "page/:num"
end

# Must go after :blog plugin
activate :directory_indexes

###
# Page options, layouts, aliases and proxies
###

page "/index.xml", :layout => false

###
# Helpers
###

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

set :markdown_engine, :redcarpet
set :markdown, {
  :fenced_code_blocks => true,
  :smartypants => true,
  :no_intra_emphasis => true
}


# Build-specific configuration
configure :build do
  # Minify CSS & JS
  activate :minify_css
  activate :minify_javascript

  # Enable cache buster
  # activate :cache_buster
end
