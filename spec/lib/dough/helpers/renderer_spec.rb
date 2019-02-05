require 'spec_helper'

class HelperWrapper
  include Dough::Helpers
end

describe Dough::Helpers::Renderer, type: :controller do
  render_views

  describe '#inset_block' do
    controller do
      helper Dough::Helpers

      def index
        render(inline: "<%= inset_block 'Some instructional text' %>")
      end
    end

    describe '#render' do
      context 'helper template found' do
        controller do
          helper Dough::Helpers

          def index
            render(inline: "<%= inset_block 'Some instructional text' %>")
          end
        end

        it 'renders the template' do
          get :index

          expect(response.body).to include('Some instructional text')
        end
      end

      context 'when ActiveSupport::SafeBuffer' do
        controller do
          helper Dough::Helpers

          def index
            render(inline: "<%= inset_block ActiveSupport::SafeBuffer.new('Some instructional text') %>")
          end
        end

        it 'renders the template' do
          get :index

          expect(response.body).to include('Some instructional text')
        end
      end

      context 'helper template not found' do
        controller do
          helper Dough::Helpers

          def index
            render(inline: "<%= foo 'Some instructional text' %>")
          end
        end

        it 'throws an exception' do
          expect do
            get :index
          end.to raise_error ActionView::Template::Error
        end
      end
    end

    describe '#inset_block' do
      before do
        get :index
      end

      it 'renders text' do
        expect(response.body).to include('Some instructional text')
      end

      it 'has an inset_block class' do
        expect(response.body).to include('class="inset-block"')
      end

      it 'has an inset_block content container class' do
        expect(response.body).to include('class="inset-block__content-container"')
      end

      it 'has an inset_block text class' do
        expect(response.body).to include('class="inset-block__text"')
      end
    end

    describe '#callout_editorial' do
      controller do
        helper Dough::Helpers

        def index
          render(inline: "<%= callout_editorial 'Some heading' %>")
        end
      end

      it 'renders text' do
        get :index

        expect(response.body).to include('Some heading')
      end

      it 'wraps the text in a div element' do
        get :index

        expect(response.body).to include('<div class="callout">')
      end

      context 'parsing html content' do
        it 'passed html heading is accessible' do
          get :index

          expect(response.body).to include('Some heading')
        end
      end
    end

    describe '#callout_instructional' do
      controller do
        helper Dough::Helpers

        def index
          render(inline: "<%= callout_instructional 'Some instructional text' %>")
        end
      end

      before do
        get :index
      end

      it 'renders the heading' do
        expect(response.body).to include('Some instructional text')
      end

      it 'wraps the text in a div element' do
        expect(response.body).to include('<div class="callout callout--instructional">')
      end
    end
  end

  describe '#tab_selector' do
    controller do
      helper Dough::Helpers

      def index
        render(inline:
               "<%=
                tab_selector :section_name do |tab|
                  tab.section do |container|
                    container.active
                    container.heading 'Some title'
                    container.content do
                      'Really complex content </br>'
                    end
                  end
                end
              %>")
      end
    end

    it 'has a tab selector' do
      get :index

      expect(response.body).to include('div class="tab-selector')
    end

    it 'creates tab wrappers' do
      get :index

      expect(response.body)
        .to include('div data-dough-tab-selector-triggers-outer class="tab-selector__triggers-outer"')
      expect(response.body)
        .to include('div data-dough-tab-selector-triggers-inner class="tab-selector__triggers-inner"')
    end

    it 'sets up the expected amount of tabs' do
      get :index

      expect(response.body).to include('div class="tab-selector__trigger-container is-active"')
    end
  end

  describe '#callout_instructional' do
    controller do
      helper Dough::Helpers

      def index
        render(inline: "<%= callout_instructional '<h3>Budgeting tips</h3>' %>")
      end
    end

    before do
      get :index
    end

    it 'renders html content' do
      expect(response.body).to include('Budgeting tips')
    end

    it 'wraps the text in a div element' do
      expect(response.body).to include('<div class="callout callout--instructional">')
    end
  end
end
