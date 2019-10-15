import joi from 'joi';
import Song from './song.model';
import { EPROTONOSUPPORT } from 'constants';
class SongController{
    
    create = async(req, res)=>{
        try{
            const schema = joi.object().keys({
                title: joi.string().required(),
                url: joi.string().required(),
                rating: joi.number().default(0).max(5).optional(),
                artist: joi.string().required()

            });
            const result =joi.validate(req.body, schema);
            if(result.error && result.error.details){
                return res.status(400).json(result.error);
            }
            const song = await Song.create(result.value);
            return res.json(song);

        } catch(e){
            console.log(e);
            return res.status(500).json(e)
        }
    }

    get = async(req, res)=>{
        try{
            const {id} = req.params;
            const result = await Song.findById(id);
            if(!result){
                return res.status(404).json({err:'Cannot find the song'});
            }
            return res.json(result);
        }catch(er){
            console.log(er);
            return res.status(500).json(er);
        }
    }

    getAll= async(req, res) =>{
        try{
            const {page, perPage} = req.query;
            const option = {page: parseInt(page, 10),
                limit: parseInt(perPage, 10)
            }
            const songs =  await Song.paginate({}, option);
            console.log(songs);
            return res.json(songs);
        } catch(er){
            console.log(er);
            return res.status(500).json(er);
        }
    }

    delete = async(req, res)=>{
        try{
            const {id} = req.params;
            const song = await Song.findOneAndDelete({_id:id});
            if(!song){
                return res.status(404).json({message: "Coudn't find the record"});
            }
            return res.status(200).json({message: 'Successflly deleted'});
        }catch(ex){
            console.log(ex);
            return res.status(500).json(er);
        }
    };

    update = async(req,res)=>{
        try{
            const songschema = joi.object().keys({
                title: joi.string().optional(),
                url: joi.string().optional(),
                rating: joi.number().min(0).max(5).optional(),
                artist: joi.string().optional()
            });
            const {error, value} = joi.validate(req.body, songschema);
            console.log(value);
            if(error && error.details){
                return res.status(400).json(value);
            }

            const {id} = req.params;
            const result = await Song.findOneAndUpdate({_id: id},value,{new:true});
            if(!result){
                return res.status(404).json({message: "Coudn't find the record"});
            }
            return res.status(200).json(result);

        } catch(ex){
            console.log(ex);
            return res.status(500).json(ex);
        };
    };
}

export default new SongController; 