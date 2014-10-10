module Dough
  module Helpers
    class TabSelector
      class << self
        def selector(section_name, &block)
          tab_element_id = section_name.to_s.gsub('_', ' ').parameterize
          @content = { element_id: tab_element_id, tabs: [] }
          yield self
          @content
        end

        def section(&block)
          @data = { active: false }
          yield self
          @content[:tabs] << @data
        end

        def active
          @data[:active] = true
        end

        def inactive
          @data[:active] = false
        end

        def heading(heading)
          @data.merge!(heading: heading)
        end

        def content(&block)
          @data.merge!(content: yield)
        end
      end
    end
  end
end
