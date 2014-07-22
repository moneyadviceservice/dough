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

        def index_with_class
          render inline: "<%= form_for @user = User.new, url: '/' do |f| %>" \
                         "  <%= f.form_row(:name, html_options: {classes: 'my-new-class'}) do |row| %>" \
                         "    <%= 'hello world' %>" \
                         "  <% end %>" \
                         "<% end %>"
        end

        def index_with_error
          @user = User.new
          @user.errors[:name] << 'fail'
          render inline: "<%= form_for @user, url: '/' do |f| %>" \
                         "  <%= f.form_row(:name) do |row| %>" \
                         "    <%= 'hello world' %>" \
                         "  <% end %>" \
                         "<% end %>"
        end

        def index_with_options
          render inline: "<%= form_for @user = User.new, url: '/' do |f| %>" \
                         "  <%= f.form_row(html_options: {classes: 'my-new-class'}) do |row| %>" \
                         "    <%= 'hello world' %>" \
                         "  <% end %>" \
                         "<% end %>"
        end
      end

      before :each do
        @routes.draw do
          get '/anonymous/index'
          get '/anonymous/index_with_class'
          get '/anonymous/index_with_error'
          get '/anonymous/index_with_options'
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

      it 'can add classes to the form row' do
        get :index_with_class
        expect(response.body).to include('my-new-class')
      end

      it 'can add classes to the form row when there is an error' do
        get :index_with_error
        expect(response.body).to include('is-errored')
      end

      it 'can use options when there are no attributes' do
        get :index_with_options
        expect(response.body).to include('my-new-class')
      end
    end
  end
end
