require 'spec_helper'

module ActionView
  module Helpers
    describe FormBuilder, type: :controller do
      render_views

      controller do
        helper Dough::Helpers

        def index
          render inline: "<%= form_for User.new, url: '/' do |f| %>" \
                         "  <%= f.form_row do %>" \
                         "    <%= 'hello world' %>" \
                         "  <% end %>" \
                         "<% end %>"
        end
      end

      it 'adds form row' do
        get :index
        expect(response.body).to include('form__row')
      end

      it 'renders row contents' do
        get :index
        expect(response.body).to include('hello world')
      end
    end
  end
end
