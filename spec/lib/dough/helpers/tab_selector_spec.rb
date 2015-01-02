require 'spec_helper'

describe Dough::Helpers::TabSelector do
  context 'a basic tab structure' do
    subject(:tab_selector) do
      Dough::Helpers::TabSelector.selector 'section_id' do |tab|
        tab.section do |container|
          container.heading 'Some title'
          container.content do
            'Really complex content</br>'
          end
        end
      end
    end

    let(:expected) do
      {
        element_id: 'section-id',
        tabs: [
          {
            active: false,
            heading: 'Some title',
            content: 'Really complex content</br>'
          }
        ]
      }
    end

    it 'builds a tabs structure' do
      expect(subject).to eql(expected)
    end
  end

  context 'multiple tabs' do
    subject(:tab_selector) do
      Dough::Helpers::TabSelector.selector 'section_id' do |tab|
        tab.section do |container|
          container.heading 'Some title'
          container.content do
            'Really complex content</br>'
          end
        end
        tab.section do |container|
          container.heading 'Another tab'
          container.content do
            'Some basic content'
          end
        end
      end
    end

    let(:expected) do
      {
        element_id: 'section-id',
        tabs: [
          {
            active: false,
            heading: 'Some title',
            content: 'Really complex content</br>'
          },
          {
            active: false,
            heading: 'Another tab',
            content: 'Some basic content'
          }
        ]
      }
    end

    it 'can collect a group of tabs' do
      expect(subject).to eql(expected)
    end
  end
end
