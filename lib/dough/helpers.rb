require 'dough/helpers/form_row'
require 'dough/helpers/renderer'
require 'dough/helpers/tab_selector'

require 'active_support/core_ext'

module Dough
  module Helpers
    def tab_selector(id, &block)
      tabs_structure = Dough::Helpers::TabSelector.selector id, &block
      render(partial: 'dough/helpers/tab_selector/tab_selector', locals: { tab_section: tabs_structure })
    end

    # Renders heading tag with accessible aria attributes.
    #
    # ==== Examples
    #
    #   heading_tag('Hello world!')
    #    # => <h1 aria-level='1' role='heading'>Hello world!</h1>
    #   heading_tag('Hello from header 2', level: 2)
    #    # => <h2 aria-level='2' role='heading'>Hello world from header 2</h2>
    #
    #   <%= heading_tag do -%>
    #     Hello world!
    #   <% end -%>
    #    # => <h1 aria-level='1' role='heading'>Hello world!</h1>
    #
    #   <%= heading_tag level: 3 do -%>
    #     Hello world!
    #   <% end -%>
    #    # => <h3 aria-level='3' role='heading'>Hello world!</h3>
    #
    def heading_tag(content_or_options_with_block = nil, options = {}, &block)
      if block_given?
        options = content_or_options_with_block if content_or_options_with_block.is_a?(Hash)
        value   = capture(&block).strip
      else
        value = content_or_options_with_block
      end

      level = options.delete(:level) { 1 }

      content_tag("h#{level}", value.html_safe, options.merge('role' => :heading, 'aria-level' => level))
    end

    #
    # Leverage method_missing so that we don't have to create boilerplate code to deliver template dependant
    # helpers.
    #
    # We should only use this pattern when a template partial is needed
    #
    def method_missing(method_name, *args, &block)
      if helper_exists?(method_name)
        parsed_args = merge_optional_string(args)
        render_helper(method_name, parsed_args)
      else
        super method_name, *args, &block
      end
    end

    private

    #
    # @TODO
    #
    # Find a better home for all this logic
    #

    #
    # Checks to see whether the a template of the same name as the helper exists.
    #
    # If it does we render that we that parameters passed
    #
    def helper_exists?(method_name)
      view_paths = ActionController::Base.view_paths
      context = ActionView::LookupContext.new(view_paths)

      context.exists?(method_name, ["dough/helpers/#{method_name}"], true)
    end

    def merge_optional_string(args)
      new_args = {}
      args.push text: args.slice!(0) if args.first.is_a?(String)
      args.each { |arg| new_args.merge!(arg) }

      new_args
    end

    def render_helper(method_name, *args)
      optional_args = *args
      options = { helper_name: method_name.to_s, renderer: self }
      optional_args.each { |option| options.merge!(option) } if optional_args

      Dough::Helpers::Renderer.new(options).render
    end
  end
end
