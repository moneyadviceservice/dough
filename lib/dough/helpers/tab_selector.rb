module Dough
  module Helpers
    class TabSelector
      class << self
        def selector(section_name)
          tab_element_id = section_name.to_s.tr('_', ' ').parameterize
          @content = { element_id: tab_element_id, tabs: [] }
          yield(self)
          @content
        end

        def section
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

        def content
          @data.merge!(content: yield(self))
        end
      end
    end
  end
end
