namespace $.$mol {

	export class $my_stackoverflow extends $.$my_stackoverflow {
		
		pages() {
			const question = this.question_cur_id()
			return [
				question ? null : this.Placeholder() ,
				this.Menu() ,
				question ? this.Details( question ) : null ,
			]
		}
		
		menu_rows() {
			const res = [] as any
			const count = Math.min( 10000 , this.questions_count() )
			for( let i = 0 ; i < count ; ++i ) {
				res.push( this.Question_link( i ) )
			}
			return res
		}
		
		question_cur_id() {
			return Number( $mol_state_arg.value( 'question' ) )
		}
		
		question_owner_by_index( index : number ) {
			return this.question_short( index ).owner.display_name
		}
		
		question_created_by_index( index : number ) {
			return $jin.time.moment( this.question_short( index ).creation_date * 1000 ).toString( 'YYYY-MM-DD hh:mm' )
		}
		
		question_title_by_index( index : number ) {
			return this.question_short( index ).title
		}
		
		question_arg_by_index( index : number ) {
			return {
				question : this.question_short( index ).question_id
			}
		}
		
		question_title( id : number ) {
			return this.question_full( id ).title
		}
		
		question_descr( id : number ) {
			return this.question_full( id ).body_markdown
		}
		
		question_permalink( id : number ) {
			return this.question_full( id ).link
		}
		
		question_short( index : number ) {
			let page_size = this.data_page_size()
			let page = Math.floor( index / page_size )
			return this.questions_data( page ).items[ index % page_size ]
		}
		
		questions_count() {
			let uri = `//api.stackexchange.com/2.2/questions?site=stackoverflow&filter=total`
			return $mol_http_resource_json.item<{ total : number }>( uri ).json().total
		}
		
		questions_data( page : number ) {
			const uri = `//api.stackexchange.com/2.2/questions?order=desc&sort=creation&site=stackoverflow&pagesize=${ this.data_page_size() }&page=${ page + 1 }`
			type Item = {
				title : string
				creation_date : number
				question_id : number
				owner : {
					display_name : string
				}
			}
			return $mol_http_resource_json.item<{ items : Item[] }>( uri ).json()
		}
		
		data_page_size() {
			return 100
		}
		
		question_full( id : number ) {
			const uri = `//api.stackexchange.com/2.2/questions/${ id }?site=stackoverflow&filter=!9YdnSJ*_T`
			type Item = {
				title : string
				body_markdown : string
				link : string
			}
			return $mol_http_resource_json.item<{ items : Item[] }>( uri ).json().items[0]
		}
		
	}
	
}
