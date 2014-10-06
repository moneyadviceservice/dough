require 'spec_helper'

module Dough
  module Helpers
    describe CalloutEditorial, type: 'controller' do
      render_views

      controller do
        helper Dough::Helpers

        def index
          render inline: "<%= callout_editorial 'hello' %>"
        end
      end

      it 'renders "text"' do
        get :index

        expect(response.body).to include('hello')
      end

      it "wraps the text in a div element" do
        get :index

        expect(response.body).to include '<div class="callout-editorial">'
      end
    end
  end
end
