require 'uglifier'

task :default do
  js = Uglifier.compile(File.read("jquery.scrollface.js"))
  File.open('jquery.scrollface.min.js', 'w') { |f| f.write(js) }
end