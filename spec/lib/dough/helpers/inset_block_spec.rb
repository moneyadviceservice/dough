require 'spec_helper'

module Dough
  module Helpers
    describe InsetBlock, type: 'controller' do
      render_views

      controller do
        helper Dough::Helpers

        def index
          render inline: "<%= inset_block 'hello' %>"
        end
      end

      it 'renders "text"' do
        get :index

        expect(response.body).to include('hello')
      end
    end
  end
end
